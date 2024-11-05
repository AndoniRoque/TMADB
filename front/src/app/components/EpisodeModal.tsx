import {
  Button,
  Checkbox,
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
} from "@chakra-ui/react";
import dayjs from "dayjs";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import {
  EpisodeModalProps,
  EpisodeData,
  Episode,
  Character,
} from "../types/types";
import axios from "axios";
const URL_BACK = "http://localhost:3333/api";

const EpisodeModal: React.FC<EpisodeModalProps> = ({
  isOpen,
  onClose,
  characters,
  initialValue,
  getEpisode,
}) => {
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

  const getCharacters = async () => {
    try {
      const characters = await axios.get(`${URL_BACK}/characters`);
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

  useEffect(() => {
    if (initialValue) {
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
      const upload = await axios.post(`${URL_BACK}/episodes`, data);
      alert("El episodio fue cargado exitosamente.");
      getEpisode();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const updateEpisode = async (submitEpisode: EpisodeData) => {
    try {
      await axios.put(`${URL_BACK}/episodes/${number}`, {
        ...submitEpisode,
        number: Number(submitEpisode.number),
        season: Number(submitEpisode.season),
      });
      alert("Episode updated successfully.");
      getEpisode();
      onClose();
    } catch (err) {
      console.error("Error updating episode:", err);
    }
  };

  const handleSubmit = async () => {
    const data: EpisodeData = {
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

  const handleCharacterChange = (selectedOptions: any) => {
    setSelectedCharacter(
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
  };

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
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Episode title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormLabel>Episode Number</FormLabel>
            <Input
              placeholder="Episode number"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              type="number"
              min={1}
            />
            <FormLabel>Season</FormLabel>
            <Input
              placeholder="Episode season"
              value={season}
              onChange={(e) => setSeason(parseInt(e.target.value))}
              type="number"
              min={1}
            />
            <FormLabel>Case #</FormLabel>
            <Input
              placeholder="Case number"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
            />
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Case description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormLabel>Release Date</FormLabel>
            <Input
              placeholder="Release date"
              value={dayjs(releaseDate).format("YYYY-MM-DD")}
              onChange={(e) => setReleaseDate(e.target.value)}
              type="date"
            />
            <FormLabel>Characters in Episode</FormLabel>
            {/* TODO: verificar que pasa si creo personajes al crear un episodio y enumero otros personajes también, un desastre seguro */}
            <ReactSelect
              options={characterOptions}
              placeholder="Character appearences..."
              isMulti
              onChange={handleCharacterChange}
              value={characterOptions.filter((option) =>
                selectedCharacter.includes(option.value)
              )}
            />
            <FormLabel>Heard Episode </FormLabel>
            <Checkbox
              isChecked={heard}
              onChange={(e) => setHeard(e.target.checked)}
            ></Checkbox>
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
