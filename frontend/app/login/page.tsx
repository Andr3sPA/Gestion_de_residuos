'use client'

import LoginForm from "@/components/LoginForm";
import { Container, Heading } from "@chakra-ui/react";

export default function Login() {
  return (
    <Container boxShadow={"lg"} borderWidth={"2px"} borderRadius={"lg"} padding={"2rem"}>
      <Heading as={"h2"} size={"lg"} paddingBottom={"1rem"} textAlign={"center"}>Log in</Heading>
      <LoginForm />
    </Container >
  )
}
