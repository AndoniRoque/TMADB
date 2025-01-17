import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import { EpisodeModalProps, EpisodeData, Character } from "../types/types";
import axios from "axios";
import { useCharacterStore } from "../store/useCharacterStore";
import { sub } from "date-fns";
const URL_BACK = "http://localhost:3333/api";

const EpisodeModal: React.FC<EpisodeModalProps> = ({
  isOpen,
  onClose,
  initialValue,
  getEpisode,
}) => {
  const { characters, getCharacters } = useCharacterStore();
  const [id, setId] = useState<number>(initialValue?.id || 0);
  const [title, setTitle] = useState<string>(initialValue?.title || "");
  const [number, setNumber] = useState<number>(initialValue?.season || 1);
  const [releaseDate, setReleaseDate] = useState<string>(
    initialValue?.releaseDate || ""
  );
  const [description, setDescription] = useState<string>(
    initialValue?.description || ""
  );
  const [heard, setHeard] = useState<boolean>(initialValue?.heard || false);
  const [caseNumber, setCaseNumber] = useState<string>(
    initialValue?.caseNumber || ""
  );
  const [season, setSeason] = useState<number>(initialValue?.season || 1);
  const [selectedCharacter, setSelectedCharacter] = useState<number[]>(
    initialValue?.characterIds || []
  );
  const [charactersList, setCharactersList] = useState<Character[]>(characters); // lista completa de personajes
  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);
  const [isReleaseDateValid, setIsReleaseDateValid] = useState<boolean>(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const [isCaseNumberValid, setIsCaseNumberValid] = useState<boolean>(true);
  const [isNumberValid, setIsNumberValid] = useState<boolean>(true);
  const [isSeasonValid, setIsSeasonsValid] = useState<boolean>(true);
  const [entity, setEntity] = useState<string>(initialValue?.entity || "");
  const [charactersOnEpisode, setCharactersOnEpisode] = useState<Character[]>(
    initialValue?.characters || []
  );
  const toast = useToast();
  const entities = [
    "BURIED",
    "CORRUPTION",
    "DARK",
    "DESOLATION",
    "END",
    "EXTINCTION",
    "EYE",
    "FLESH",
    "HUNT",
    "LONELY",
    "SLAUGHTER",
    "SPIRAL",
    "STRANGER",
    "VAST",
    "WEB",
  ];

  const characterOptions = charactersList.map((character) => ({
    value: character.id,
    label: character.name,
  }));

  useEffect(() => {
    setCharactersOnEpisode(initialValue?.characters || []);
  }, [initialValue?.characters]);

  const listOfCharactersOnThisEpisode =
    charactersOnEpisode?.map((char: any) => {
      // Check if we're dealing with a nested character object or direct character
      if (char.character) {
        return {
          value: char.character.id,
          label: char.character.name,
        };
      } else {
        return {
          value: char.value,
          label: char.label,
        };
      }
    }) || []; // Add a default empty array in case charactersOnEpisode is null

  const handleCharacterChange = (newSelectedOptions: any) => {
    // Update the display state
    setCharactersOnEpisode(newSelectedOptions || []);

    // Update the IDs state with the new selection
    const newSelectedIds = newSelectedOptions
      ? newSelectedOptions.map((opt: any) => opt.value)
      : [];
    setSelectedCharacter(newSelectedIds);
  };

  const getInitialSelectedCharacters = () => {
    if (!initialValue?.characterIds || !characters) return [];

    return initialValue.characterIds
      .map((id) => {
        const character = characters.find((c) => c.id === id);
        return character
          ? {
              value: character.id,
              label: character.name,
            }
          : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (initialValue) {
      setId(initialValue.id);
      setTitle(initialValue.title);
      setNumber(initialValue.number);
      setReleaseDate(initialValue.releaseDate);
      setDescription(initialValue.description);
      setHeard(initialValue.heard);
      setCaseNumber(initialValue.caseNumber);
      setSeason(initialValue.season);
      setSelectedCharacter(initialValue.characterIds);
    }
  }, [initialValue]);

  const uploadEpisode = async (data: EpisodeData) => {
    try {
      const upload = await axios.post(`${URL_BACK}/episodes`, data, {
        withCredentials: true,
      });
      if (upload.status === 200) {
        if (!toast.isActive) {
          toast({
            id: data.id,
            title: "Episode added successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        getEpisode();
        onClose();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        if (!toast.isActive(id)) {
          toast({
            id: data.id,
            title: "Episode already exists.",
            description: err.response.data.message,
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } else if (
        title === "" ||
        releaseDate === "" ||
        description === "" ||
        caseNumber === ""
      ) {
        if (!toast.isActive(id)) {
          toast({
            id: data.id,
            title:
              "Fields Title, Number, Release Date, Description & Case Number must be filled.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      }
      console.error(err);
    }
  };

  const updateEpisode = async (submitEpisode: EpisodeData) => {
    try {
      const updatedFields: Partial<EpisodeData> = {};

      if (submitEpisode.title !== initialValue?.title)
        updatedFields.title = submitEpisode.title;
      if (submitEpisode.number !== initialValue?.number)
        updatedFields.number = submitEpisode.number;
      if (submitEpisode.releaseDate !== initialValue?.releaseDate)
        updatedFields.releaseDate = submitEpisode.releaseDate;
      if (submitEpisode.description !== initialValue?.description)
        updatedFields.description = submitEpisode.description;
      if (submitEpisode.caseNumber !== initialValue?.caseNumber)
        updatedFields.caseNumber = submitEpisode.caseNumber;
      if (submitEpisode.season !== initialValue?.season)
        updatedFields.season = submitEpisode.season;
      if (
        JSON.stringify(submitEpisode.characterIds) !==
        JSON.stringify(initialValue?.characterIds)
      ) {
        updatedFields.characterIds = submitEpisode.characterIds;
      }

      const updateEp = await axios.put(
        `${URL_BACK}/episodes/${id}`,
        {
          ...updatedFields,
          number: Number(number),
          season: Number(season),
        },
        {
          withCredentials: true,
        }
      );
      if (updateEp.status === 200) {
        toast({
          id: submitEpisode.id,
          title: "Episode added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getEpisode();
        onClose();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        if (!toast.isActive(id)) {
          toast({
            id: submitEpisode.id,
            title: "Episode already exists.",
            description: err.response.data.message,
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else if (
          title === "" ||
          releaseDate === "" ||
          description === "" ||
          caseNumber === ""
        ) {
          if (!toast.isActive(id)) {
            toast({
              id: submitEpisode.id,
              title:
                "Fields Title, Number, Release Date, Description & Case Number must be filled.",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          }
        }
      }
    }
  };

  const handleSubmit = async () => {
    const isFormValid =
      title && number && releaseDate && description && caseNumber;

    setIsTitleValid(!!title);
    setIsReleaseDateValid(!!releaseDate);
    setIsDescriptionValid(!!description);
    setIsCaseNumberValid(!!caseNumber);
    setIsNumberValid(!!number);
    setIsSeasonsValid(!!season);

    if (!isFormValid) {
      toast({
        title: "All required fields must be filled.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const data: EpisodeData = {
      id,
      title,
      number,
      releaseDate: dayjs(releaseDate, "YYYY-MM-DD").toISOString(),
      description,
      heard,
      caseNumber,
      season,
      characterIds: selectedCharacter,
      entity,
    };

    initialValue ? updateEpisode(data) : uploadEpisode(data);
  };

  useEffect(() => {
    if (initialValue?.characterIds && characters.length > 0) {
      const initialSelected = initialValue.characterIds
        .map((characterId) => {
          const character = characters.find((c) => c.id === characterId);
          return character
            ? {
                value: character.id,
                label: character.name,
              }
            : null;
        })
        .filter(Boolean);

      setSelectedCharacter(initialValue.characterIds);
    }
  }, [initialValue, characters]);

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialValue ? "Edit Episode" : "Upload Episode"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel mb={0}>Title</FormLabel>
            <Input
              placeholder="Episode title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              borderColor={!isTitleValid ? "red.500" : "gray"}
            />
            <FormLabel mt={5} mb={0}>
              Episode Number
            </FormLabel>
            <Input
              placeholder="Episode number"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              type="number"
              min={1}
              borderColor={!isNumberValid ? "red.500" : "gray"}
            />
            <FormLabel mt={5} mb={0}>
              Season
            </FormLabel>
            <Input
              placeholder="Episode season"
              value={season}
              onChange={(e) => setSeason(parseInt(e.target.value))}
              type="number"
              min={1}
              max={5}
              borderColor={!isSeasonValid ? "red.500" : "gray"}
            />
            <FormLabel mt={5} mb={0}>
              Case #
            </FormLabel>
            <Input
              placeholder="Case number"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              borderColor={!isCaseNumberValid ? "red.500" : "gray"}
            />
            <FormLabel mt={5} mb={0}>
              Description
            </FormLabel>
            <Textarea
              placeholder="Case description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              borderColor={!isDescriptionValid ? "red.500" : "gray"}
            />
            <FormLabel mt={5} mb={0}>
              Release Date
            </FormLabel>
            <Input
              placeholder="Release date"
              value={dayjs(releaseDate).format("YYYY-MM-DD")}
              onChange={(e) => setReleaseDate(e.target.value)}
              type="date"
              borderColor={!isReleaseDateValid ? "red.500" : "gray"}
            />
            <FormLabel mt={5} mb={0}>
              Characters in Episode
            </FormLabel>
            <ReactSelect
              options={characterOptions}
              isMulti
              placeholder="Character appearances..."
              onChange={handleCharacterChange}
              value={listOfCharactersOnThisEpisode} // Usar selectedCharacters en lugar de getInitialSelectedCharacters()
            />
            <FormLabel mt={5} mb={0}>
              Entity
            </FormLabel>
            <Select
              placeholder="Select an entity"
              value={entity} // El estado que controla el valor seleccionado
              onChange={(e) => setEntity(e.target.value)} // Actualiza el estado cuando cambias la selección
            >
              {entities.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {initialValue ? "Update" : "Upload"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EpisodeModal;
