import React from "react";
import { Character, Episode } from "../types/types";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

type Props = {
  item: Character[] | Episode;
};

const CustomTable: React.FC<Props> = (item) => {
  const isCharacter = Array.isArray(item);
  console.log(isCharacter);

  return (
    <>
      <TableContainer>
        <Table variant="simple" color={"whitesmoke"}>
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              {isCharacter ? (
                <>
                  <Th isNumeric color={"whitesmoke"}>
                    Character id
                  </Th>
                  <Th color={"whitesmoke"}>Character Name</Th>
                  <Th color={"whitesmoke"}>Character Description</Th>
                </>
              ) : (
                <>
                  <Th isNumeric>Episode id</Th>
                  <Th> Episode Title </Th>
                  <Th> Case Number </Th>
                  <Th> Description </Th>
                  <Th> Release Date </Th>
                  <Th isNumeric> Season </Th>
                  <Th> Heard </Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {!isCharacter ? (
              <>
                <Tr>
                  {item.map((character: Character) => (
                    <>
                      <Td>{character.id}</Td>
                      <Td>{character.name}</Td>
                      <Td isNumeric>{character.description}</Td>
                    </>
                  ))}
                </Tr>
              </>
            ) : (
              <>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>centimetres (cm)</Td>
                  <Td isNumeric>30.48</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td isNumeric>0.91444</Td>
                </Tr>
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;
