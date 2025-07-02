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
                key:""  
            }
        }}
        
        />
    </div>
)
}

export default Ia;