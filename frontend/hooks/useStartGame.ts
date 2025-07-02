import { useNavigate } from "react-router-dom";

// Utils
import { checkName } from "../utils/checkName";

export function useStartGame(
    nickname: string,
    setNickname: (val: string) => void,
) {
    const navigate = useNavigate();

    const startGame = async () => {
        const errorEl = document.getElementById("profanity-error");

        if (checkName(nickname)) {
            errorEl!.style.visibility = "visible";
            localStorage.removeItem("nickname");
            localStorage.removeItem("token");
            setNickname("");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname }),
            });

            if (!res.ok) throw new Error("Registration failed");

            const { token } = await res.json();

            localStorage.setItem("nickname", nickname);
            localStorage.setItem("token", token);
            errorEl!.style.visibility = "hidden";

            navigate("/game");
        } catch (err: any) {
            console.error("Error registering user:", err.message || err);
            alert("There was a problem starting your game. Try again.");
        }
    };

    return startGame;
}
