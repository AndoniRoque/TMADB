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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import { EpisodeModalProps, EpisodeData, Character } from "../types/types";
import axios from "axios";
const URL_BACK = "http://localhost:3333/api";

const EpisodeModal: React.FC<EpisodeModalProps> = ({
  isOpen,
  onClose,
  characters,
  initialValue,
  getEpisode,
}) => {
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
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [charactersList, setCharactersList] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);
  const [isReleaseDateValid, setIsReleaseDateValid] = useState<boolean>(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const [isCaseNumberValid, setIsCaseNumberValid] = useState<boolean>(true);
  const [isNumberValid, setIsNumberValid] = useState<boolean>(true);
  const [isSeasonValid, setIsSeasonsValid] = useState<boolean>(true);
  const toast = useToast();

  const getCharacters = async () => {
    try {
      const characters = await axios.get(`${URL_BACK}/characters`, {
        withCredentials: true,
      });
      if (characters.data.message) {
        setCharacterMessage(characters.data.message);
      } else {
        setCharactersList(characters.data);
      }
    } catch (err) {
      setCharacterMessage("Characters not found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const characterOptions = charactersList.map((character) => ({
    value: character.id,
    label: character.name,
  }));

  const initialSelectedCharacters = characters.map((characterEntry) => ({
    value: characterEntry.character?.id,
    label: characterEntry.character?.name,
  }));

  const handleCharacterChange = (selectedOptions: any) => {
    setSelectedCharacter(
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
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

  useEffect(() => {
    getCharacters();
  }, []);

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
      const updateEp = await axios.put(
        `${URL_BACK}/episodes/${number}`,
        {
          ...submitEpisode,
          number: Number(submitEpisode.number),
          season: Number(submitEpisode.season),
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
    };

    initialValue ? updateEpisode(data) : uploadEpisode(data);
  };

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={0} backgroundColor={"#E8DCB8"}>
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
              defaultValue={initialSelectedCharacters}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "#E8DCB8",
                  borderColor: "gray",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "#E8DCB8",
                  borderColor: "gray",
                }),
              }}
            />
            <Flex flexDirection={"row"} alignItems={"end"}>
              <FormLabel mt={5} mb={0}>
                Heard Episode{" "}
              </FormLabel>
              <Checkbox
                isChecked={heard}
                onChange={(e) => setHeard(e.target.checked)}
                backgroundColor={"white"}
                mb={2}
              ></Checkbox>
            </Flex>
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
