import {
  Button,
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
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import React, { useState } from "react";
import { Character, CharacterData, CharacterModalProps } from "../types/types";
import axios from "axios";
import { useParams } from "next/navigation";
const URL_BACK = "http://localhost:3333/api";

const CharacterModal: React.FC<CharacterModalProps> = ({
  onClose,
  isOpen,
  initialValue,
  id,
  getEpisode,
  charactersList,
  characters,
}) => {
  const params = useParams();
  const characterId = params.id;
  const [allCharacters, setAllCharacters] = useState<Character[]>(characters);
  const [characterName, setCharacterName] = useState<string>(
    initialValue?.name || ""
  );
  const [characterDescription, setCharacterDescription] = useState<string>(
    initialValue?.description || ""
  );
  const [selectedCharacter, setSelectedCharacter] = useState<number[]>(
    charactersList?.map((character) => character.characterId) || []
  );
  const toast = useToast();

  const handleSubmit = async () => {
    const data: CharacterData = {
      name: characterName,
      description: characterDescription,
      episode: id,
    };

    const updateData: CharacterData = {
      name: characterName,
      description: characterDescription,
    };

    initialValue ? updateCharacter(updateData) : uploadCharacter(data);
  };

  const uploadCharacter = async (data: CharacterData) => {
    try {
      const upload = await axios.post(`${URL_BACK}/characters`, data);
      if (upload.status === 200) {
        toast({
          title: "Character added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getEpisode && getEpisode();
        onClose();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        toast({
          title: "Character already exists",
          description: err.response.data.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else if (characterName === "" || characterDescription === "") {
        toast({
          title: "Field name and description must be filled.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const updateCharacter = async (data: CharacterData) => {
    try {
      const update = await axios.put(
        `${URL_BACK}/characters/${characterId}`,
        data
      );
      if (update.status === 200) {
        toast({
          title: "Character updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getEpisode && getEpisode();
        onClose();
      } else {
        toast({
          title: "update.message",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        toast({
          title: "No characters found.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
      console.error("Error updating episode:", err);
    }
  };

  const characterOptions = allCharacters?.map((character) => ({
    value: character.id,
    label: character.name,
  }));

  console.log("characterOptions", characters);

  const handleCharacterChange = (selectedOptions: any) => {
    const selectedValue = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setSelectedCharacter(selectedValue);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel mb={0}>Name</FormLabel>
              <ReactSelect
                options={characterOptions}
                isMulti
                placeholder="Select characters..."
                onChange={handleCharacterChange}
                value={characterOptions?.filter((option) =>
                  selectedCharacter.includes(option.value)
                )}
              />

              <Text> Or add a new character </Text>
              <Input
                placeholder="Character name..."
                onChange={(e) => setCharacterName(e.target.value)}
                value={characterName}
                mt={0}
              />
              <FormLabel mt={5} mb={0}>
                Description
              </FormLabel>
              <Textarea
                placeholder="Character description..."
                onChange={(e) => setCharacterDescription(e.target.value)}
                value={characterDescription}
                mt={0}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CharacterModal;
