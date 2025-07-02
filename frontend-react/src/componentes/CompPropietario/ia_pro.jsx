import { DeepChat } from "deep-chat-react";

function Ia(){
    return(
    <div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "100vw",
    }}
    >
        <DeepChat
        directConnection={{
            openAI:{
                key:"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"  
            }
        }}
        
        />
    </div>
)
}

export default Ia;