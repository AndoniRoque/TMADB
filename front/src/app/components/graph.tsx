"use client";
import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { Box, Spinner } from "@chakra-ui/react";
import axios from "axios";
const base_url = "http://localhost:3333/api/";

const Graph = () => {
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${base_url}graph/episodes`, {
          withCredentials: true,
        });
        setElements(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching graph data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box height="75vh" width="75%">
      <ReactFlow
        nodes={elements.nodes}
        edges={elements.edges}
        fitView
        style={{ background: "#f0f0f0" }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default Graph;
