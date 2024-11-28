import { ReactFlow, Controls, Panel } from "reactflow";

import "reactflow/globals.css";

function Flow() {
  return (
    <ReactFlow>
      <Controls showInteractive={false} />
      <Panel position="top-left">React flow mindmap</Panel>
    </ReactFlow>
  );
}

export default Flow;
