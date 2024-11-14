import React from "react";
import { Character, CharacterOrEpisode, Episode } from "../types/types";
import {
  Checkbox,
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
import dayjs from "dayjs";
import axios from "axios";
const URL_BACK = "http://localhost:3333/api";

type TableData = {
  data: Character[] | Episode[];
  type: "character" | "episode";
  refreshEpisodes: () => void;
};

const CustomTable: React.FC<TableData> = ({ data, type, refreshEpisodes }) => {
  const heardEpisode = async (episode: Episode) => {
    try {
      const { data } = await axios.put(`${URL_BACK}/episodes/${episode.id}`, {
        heard: !episode.heard,
      });
      refreshEpisodes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple" color={"whitesmoke"}>
          <Thead>
            <Tr>
              {type === "character" ? (
                <>
                  <Th isNumeric color={"whitesmoke"}>
                    Character id
                  </Th>
                  <Th color={"whitesmoke"}>Character Name</Th>
                  <Th color={"whitesmoke"}>Character Description</Th>
                </>
              ) : (
                <>
                  <Th isNumeric color={"whitesmoke"}>
                    Episode id
                  </Th>
                  <Th color={"whitesmoke"}> Episode Title </Th>
                  <Th color={"whitesmoke"}> Case Number </Th>
                  <Th color={"whitesmoke"}> Description </Th>
                  <Th color={"whitesmoke"}> Release Date </Th>
                  <Th isNumeric color={"whitesmoke"}>
                    {" "}
                    Season{" "}
                  </Th>
                  <Th color={"whitesmoke"}> Heard </Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {type === "character"
              ? (data as Character[]).map((character) => (
                  <>
                    <Tr>
                      <Td>{character.id}</Td>
                      <Td>{character.name}</Td>
                      <Td>{character.description}</Td>
                    </Tr>
                  </>
                ))
              : (data as Episode[]).map((episode) => (
                  <>
                    <Tr>
                      <Td>M.A.G {episode.number}</Td>
                      <Td>{episode.title}</Td>
                      <Td>{episode.caseNumber}</Td>
                      <Td minW={"50vw"}>
                        {episode.heard ? (
                          episode.description
                        ) : (
                          <Text backgroundColor={"black"} textAlign={"center"}>
                            [Redacted]
                          </Text>
                        )}
                      </Td>
                      <Td>{dayjs(episode.releaseDate).format("DD-MM-YYYY")}</Td>
                      <Td>{episode.season}</Td>
                      <Td>
                        <Checkbox
                          isChecked={episode.heard}
                          onChange={() => heardEpisode(episode)}
                        ></Checkbox>
                      </Td>
                    </Tr>
                  </>
                ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;
