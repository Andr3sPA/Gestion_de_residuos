import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Collapse, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { isEmail } from "validator";

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // min 8 chars only for login
  const passwordRequirements = {
    minLength: 8,
  }

  const invalidPassword = password.length > 0 &&
    password.length < passwordRequirements.minLength;

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
          <Button colorScheme="blue">Proceed</Button>
        </ButtonGroup>
      </FormControl>
    </Flex>
  )
}
