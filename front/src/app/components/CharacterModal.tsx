import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverTrigger,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CharacterData, CharacterModalProps } from "../types/types";
import { useCharacterStore } from "../store/useCharacterStore";

const URL_BACK = "http://localhost:3333/api";

const CharacterModal: React.FC<CharacterModalProps> = ({
  onClose,
  isOpen,
  initialValue,
  id,
  getEpisode,
}) => {
  const {
    characters,
    getCharacters,
    loading: charactersLoading,
  } = useCharacterStore();
  const {
    isOpen: isOpenInput,
    onOpen: onOpenInput,
    onClose: onCloseInput,
  } = useDisclosure();
  const params = useParams();
  const characterId = params.id;
  const [characterDescription, setCharacterDescription] = useState<string>(
    initialValue?.description || ""
  );
  const toast = useToast();
  const [displayList, setDisplayList] = useState<string>("none");
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<string[]>(
    characters.map((char) => char.name) || []
  );

  const handleSubmit = async () => {
    if (!inputValue || !characterDescription) {
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
        name: inputValue,
        description: characterDescription,
      });
    } else {
      await uploadCharacter({
        name: inputValue,
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
        getCharacters();

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
        `${URL_BACK}/characters/${characterId}`,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    const filteredOptions = characters
      .map((char) => char.name)
      .filter((name) =>
        name.toLowerCase().includes(e.target.value.toLowerCase())
      );

    setOptions(filteredOptions);

    if (e.target.value) {
      setDisplayList("");
      onOpenInput();
    } else {
      setDisplayList("none");
      onCloseInput();
    }
  };

  useEffect(() => {
    getCharacters();
  }, []);

  useEffect(() => {
    setOptions(characters.map((char) => char.name));
  }, [characters]);

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

            <Popover isOpen={isOpenInput} onClose={onCloseInput} matchWidth>
              <PopoverTrigger>
                <Input
                  placeholder="Character name..."
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </PopoverTrigger>
              <PopoverBody
                display={displayList}
                position="absolute"
                zIndex="overlay"
                maxH="200px"
                overflowY="auto"
                boxShadow="md"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                w={"full"}
              >
                <List display={displayList}>
                  {options
                    .filter((option) =>
                      option?.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((option, index) => (
                      <ListItem
                        key={index}
                        p="2"
                        _hover={{ bg: "gray.100", cursor: "pointer" }}
                        onClick={() => {
                          setInputValue(option);
                          onCloseInput();
                        }}
                      >
                        {option}
                      </ListItem>
                    ))}
                </List>
              </PopoverBody>
            </Popover>

            <FormLabel mt={5} mb={0}>
              Description
            </FormLabel>
            <Textarea
              placeholder="Character description..."
              onChange={(e) => setCharacterDescription(e.target.value)}
              value={characterDescription}
              mt={2}
              sx={{
                whiteSpace: "pre-wrap",
              }}
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
