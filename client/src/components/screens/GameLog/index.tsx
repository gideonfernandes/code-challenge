import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { IMAGES, ICONS, COLORS } from "../../../constants";
import FlexOffset from "../../atoms/FlexOffset";
import { FormContainer } from "../../molecules";
import { IProcessRanking } from "../../../libs/interfaces/screens";
import { Container, Header, UploadLog, TeamModeSwitch } from "./styles";
import { gameLog } from "../../../libs/validations";
import { getValidationErrors, truncateString } from "../../../utils";
import { Button, Input } from "../../atoms";

const GameLog: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const uploadLogRef = useRef<HTMLInputElement>(null);

  const history = useHistory();

  const [log, setLog] = useState<File | null>(null);
  const [logError, setLogError] = useState<string | null>(null);
  const [teamMode, setTeamMode] = useState(false);

  const handleSubmit = useCallback(
    async (data: IProcessRanking): Promise<void> => {
      try {
        if (!log) {
          Swal.fire(
            "Impossible...",
            "To process a Ranking, a Game Log is required!",
            "error"
          );
          return;
        }

        formRef.current?.setErrors({});
        setLogError(null);

        const gamelogData = { ...data, log, team_mode: teamMode };

        await gameLog.validate(gamelogData, {
          abortEarly: false,
        });

        // await processRanking({
        //   description: gamelogData.description,
        //   file: gamelogData.log,
        // });

        history.push("processing");
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          console.log(error);
          formRef.current?.setErrors(errors);
          setLogError(errors.log);

          return;
        }
      }
    },
    [log]
  );

  function handleSelectLog(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedFile = event.target.files[0];

    setLog(selectedFile);
  }

  function handleClearLog(event: any) {
    event.preventDefault();

    setLog(null);
    setLogError(null);

    if (uploadLogRef.current) {
      uploadLogRef.current.value = "";
    }
  }

  useEffect(() => {
    console.log(log);
  }, [log]);

  return (
    <Container>
      <Header>
        <div>
          <img src={IMAGES.download} alt="Baixar Exemplo de Log" />
          <h2>{teamMode ? "TEAM GAME LOG EXAMPLE" : "GAME LOG EXAMPLE"}</h2>
        </div>
        <img src={IMAGES.logout} alt="Sair do Husky Fire" />
      </Header>

      <section>
        <FormContainer formRef={formRef} handleSubmit={handleSubmit}>
          <Input name="description" label="Descrição" />

          <UploadLog withLog={!!log}>
            <label>Add Game Logs *</label>
            <label htmlFor={!log ? "log" : ""}>
              {log ? (
                <>
                  <p>{truncateString(log.name, 30)}</p>
                  <ICONS.AI.AiOutlineClose
                    size={20}
                    color={COLORS.error}
                    onClick={(event) => handleClearLog(event)}
                  />
                </>
              ) : (
                <ICONS.FI.FiPlus size={24} color={COLORS.lightBlue} />
              )}
            </label>

            <input
              id="log"
              type="file"
              ref={uploadLogRef}
              onChange={handleSelectLog}
            />

            {logError && <p>{logError}</p>}
          </UploadLog>

          <TeamModeSwitch withTeamMode={!!teamMode}>
            <label>TEAM mode?</label>
            <button
              type="button"
              onClick={() => setTeamMode((oldState) => !oldState)}
            >
              {!!teamMode && <FlexOffset />}
              <div />
            </button>
          </TeamModeSwitch>

          <Button text="PROCESS RANKING" />
        </FormContainer>
      </section>

      <footer>
        <FlexOffset />
        <h3>GLOBAL RANKING</h3>
        <img src={IMAGES.eye} alt="Ver Ranking Global" />
      </footer>
    </Container>
  );
};

export default GameLog;
