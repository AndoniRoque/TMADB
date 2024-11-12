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
import { CharacterData, CharacterModalProps } from "../types/types";
import axios from "axios";
import { useParams } from "next/navigation";
const URL_BACK = "http://localhost:3333/api";

const CharacterModal: React.FC<CharacterModalProps> = ({
  onClose,
  isOpen,
  initialValue,
  id,
  getEpisode,
}) => {
  const params = useParams();
  const characterId = params.id;
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
      await axios.post(`${URL_BACK}/characters`, data);
      alert("The character was uploaded successfully.");
      getEpisode && getEpisode();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const updateCharacter = async (data: CharacterData) => {
    try {
      await axios.put(`${URL_BACK}/characters/${characterId}`, data);
      alert("Episode updated successfully.");
      getEpisode && getEpisode();
      onClose();
    } catch (err) {
      console.error("Error updating episode:", err);
    }
  };

  // TODO: agregar los personajes ya creados al modal Add Characters para poder seleccionar los que ya estan creados

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
                value={characterName}
              />
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Character description..."
                onChange={(e) => setCharacterDescription(e.target.value)}
                value={characterDescription}
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
