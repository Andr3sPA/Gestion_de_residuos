import { useAuth } from "@/contexts/Auth";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Alert, Box, Button, ButtonGroup, Collapse, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { isEmail } from "validator";

export default function LoginForm({ popoverOnClose }:
  { popoverOnClose: any }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState({ status: "pending", info: "" })
  const auth = useAuth()


  const handleSubmit = async () => {
    setResponse({ status: "loading", info: "" })
    auth.login({ email, password }).then(() => {
      popoverOnClose()
      setResponse({ status: "ok", info: "" })
    }
    ).catch((err) => {
      const res = { status: "error", info: "" }
      res.info = err.response ? err.response.data.error : "Error al enviar los datos"
      setResponse(res)
    })
  }

  const invalidPassword = password.length > 0 && password.length < 8

  return (
    <Flex as={'form'} flexDir={"column"} gap={"1rem"}>
      <FormControl isRequired isInvalid={email.length > 0 && !isEmail(email)} >
        <FormLabel>Email</FormLabel>
        <Input onChange={(e: any) => setEmail(e.target.value)}
          inputMode="email" autoComplete="email" required placeholder="example@mail.com" />
      </FormControl>
      <FormControl isRequired isInvalid={invalidPassword}>
        <FormLabel>Contraseña</FormLabel>
        <Input onChange={(e: any) => setPassword(e.target.value)}
          inputMode="text" type="password" autoComplete="current-password" required placeholder="********" />
        <Collapse in={invalidPassword} animateOpacity
          transition={{ exit: { duration: .75 }, enter: { duration: .75 } }}
        >
          <Box>
            <FormErrorMessage alignItems={"baseline"}>
              <InfoOutlineIcon marginRight={"1rem"} marginTop={"1rem"} />
              Escriba al menos 8 caracteres
            </FormErrorMessage>
          </Box>
        </Collapse>
        <Divider className="my-4" />
        <ButtonGroup className="flex flex-row w-full place-content-center">
          <Button colorScheme="blue" variant={"outline"}>
            Registrarse
          </Button>
          <Button onClick={handleSubmit} isLoading={response.status === "loading"}
            isDisabled={invalidPassword || !isEmail(email) || email.length <= 0 || password.length <= 0}
            width={"7rem"} colorScheme="blue">Enviar</Button>
        </ButtonGroup>
      </FormControl>
      <Collapse in={response.status === "error"}>
        <Alert status="error">{response.info}</Alert>
      </Collapse>
    </Flex>
  )
}
