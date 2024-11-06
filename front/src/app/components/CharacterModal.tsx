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
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Character, CharacterData, CharacterModalProps } from "../types/types";
import axios from "axios";
const URL_BACK = "http://localhost:3333/api";

const CharacterModal: React.FC<CharacterModalProps> = ({
  onClose,
  isOpen,
  initialValue,
  id,
}) => {
  const [characterName, setCharacterName] = useState<string>(
    initialValue?.name || ""
  );
  const [characterDescription, setCharacterDescription] = useState<string>(
    initialValue?.description || ""
  );

  const handleSubmit = async () => {
    const data: CharacterData = {
      name: characterName,
      description: characterDescription,
    };

    initialValue ? updateCharacter(data) : uploadCharacter(data);
  };

  const uploadCharacter = async (data: CharacterData) => {
    try {
      await axios.post(`${URL_BACK}/characters`, data);
      alert("The character was uploaded successfully.");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const updateCharacter = async (submitCharacter: CharacterData) => {
    try {
      await axios.put(`${URL_BACK}/characters/${id}`, {
        submitCharacter,
      });
      alert("Episode updated successfully.");
      onClose();
    } catch (err) {
      console.error("Error updating episode:", err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Character name..."
                onChange={(e) => setCharacterName(e.target.value)}
              />
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Character description..."
                onChange={(e) => setCharacterDescription(e.target.value)}
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
