import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
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
import CreatableSelect from "react-select/creatable";
import { useParams } from "next/navigation";
import axios from "axios";
import { Character, CharacterData, CharacterModalProps } from "../types/types";

const URL_BACK = "http://localhost:3333/api";

const CharacterModal: React.FC<CharacterModalProps> = ({
  onClose,
  isOpen,
  initialValue,
  id,
  getEpisode,
  charactersList = [],
  characters = [],
}) => {
  const params = useParams();
  const characterId = params.id;
  const [allCharacters, setAllCharacters] = useState<Character[]>(
    Array.isArray(characters) ? characters : []
  );
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
    if (!characterName || !characterDescription) {
      toast({
        title: "Field name and description must be filled.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (initialValue) {
      await updateCharacter({
        name: characterName,
        description: characterDescription,
      });
    } else {
      await uploadCharacter({
        name: characterName,
        description: characterDescription,
        ...(id && { episode: id }),
      });
    }
  };

  const uploadCharacter = async (data: CharacterData) => {
    try {
      const response = await axios.post(`${URL_BACK}/characters`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const updatedCharactersResponse = await axios.get(
          `${URL_BACK}/characters`
        );
        setAllCharacters(updatedCharactersResponse.data);

        toast({
          title: "Character added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getEpisode?.();
        onClose();
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast({
          title: "Character already exists",
          description: err.response.data.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const updateCharacter = async (data: CharacterData) => {
    try {
      const response = await axios.put(
        `${URL_BACK}/characters/${initialValue?.id}`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast({
          title: "Character updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        getEpisode?.();
        onClose();
      }
    } catch (err: any) {
      console.error("Error updating character:", err);
      toast({
        title: "Error updating character",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const characterOptions = allCharacters.map((character) => ({
    value: character.id,
    label: character.name,
  }));

  const handleCharacterChange = (
    selectedOptions: Array<{ value: number; label: string }> | null
  ) => {
    const selectedValue = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedCharacter(selectedValue);

    // If an existing character is selected, set its name
    if (selectedOptions && selectedOptions.length > 0) {
      setCharacterName(selectedOptions[0].label);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialValue ? "Edit Character" : "Add Character"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel mb={0}>Characters</FormLabel>
            <CreatableSelect
              options={characterOptions}
              isMulti
              placeholder="Select or create characters..."
              onChange={handleCharacterChange}
              onCreateOption={(inputValue) => setCharacterName(inputValue)}
              value={characterOptions.filter((option) =>
                selectedCharacter.includes(option.value)
              )}
            />

            <FormLabel mt={5} mb={0}>
              Description
            </FormLabel>
            <Textarea
              placeholder="Character description..."
              onChange={(e) => setCharacterDescription(e.target.value)}
              value={characterDescription}
              mt={2}
            />
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

export default CharacterModal;
