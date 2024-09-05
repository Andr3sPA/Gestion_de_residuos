import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Collapse, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { isEmail } from "validator";
import axios from "axios";
export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit = async (e:any) => {
      e.preventDefault();

      try {
          const formDataToSend = new FormData();
          formDataToSend.append('email', email);
          formDataToSend.append('password', password);

          const response = await axios.post('http://localhost:3001/users/login', formDataToSend, { withCredentials: true });
          console.log('Form data submitted successfully:', response.data);
          // Aquí podrías redirigir al usuario a otra página o mostrar un mensaje de éxito
      } catch (error:any) {
          console.error('Error submitting form data:', error);
          if (error.response) {
              console.error('Response data:', error.response.data);
              // Aquí podrías mostrar un mensaje de error específico en tu interfaz de usuario
          } else if (error.request) {
              console.error('Request made but no response received:', error.request);
              // Aquí podrías manejar errores relacionados con la solicitud
          } else {
              console.error('Error setting up the request:', error.message);
              // Aquí podrías manejar otros tipos de errores
          }
      }

  };
  const invalidPassword=password.length>0 && password.length<8

  return (
    <Flex flexDir={"column"} gap={"1rem"}>
      <FormControl isRequired isInvalid={email.length > 0 && !isEmail(email)} >
        <FormLabel>Email</FormLabel>
        <Input onChange={(e) => setEmail(e.target.value)}
          inputMode="email" required placeholder="example@mail.com" />
      </FormControl>
      <FormControl isRequired isInvalid={invalidPassword}>
        <FormLabel>Password</FormLabel>
        <Input onChange={(e) => setPassword(e.target.value)}
          inputMode="text" type="password" required placeholder="********" />
        <Collapse in={invalidPassword} animateOpacity
          transition={{ exit: { duration: .75 }, enter: { duration: .75 } }}
        >
          <Box>
            <FormErrorMessage alignItems={"baseline"}>
              <InfoOutlineIcon marginRight={"1rem"} marginTop={"1rem"} />
              Type at least 8 characteres
            </FormErrorMessage>
          </Box>
        </Collapse>
        <Divider className="my-4" />
        <ButtonGroup className="flex flex-row w-full place-content-center">
          <Button colorScheme="blue" variant={"outline"}>
            Register
          </Button>
          <Button onClick={handleSubmit} colorScheme="blue">Proceed</Button>
        </ButtonGroup>
      </FormControl>
    </Flex>
  )
}
