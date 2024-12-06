import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import Graph from "../components/graph";

function Mindmap() {
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Text mt={150} fontWeight={600} color={"whitesmoke"}>
        Mindmap
      </Text>
      <Graph />
    </Flex>
  );
}

export default Mindmap;
