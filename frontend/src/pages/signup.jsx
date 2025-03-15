import React, { useState } from "react";
import {
  Container,
  Input,
  Button,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Text,
  HStack,
  RadioGroup,
  Radio,
  Stack,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    userId: "",
    password: "",
    confirmPassword: "",
    veganOptions: false,
    allergies: [], // ✅ Use the correct spelling
    meatConsumption: "None",
    fishConsumption: "None",
    vegetableConsumption: "None",
    spiciness: "None",
    allergyInput: "", // ✅ Add missing state for input field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleAddAllergy = () => {
    if (
      form.allergyInput.trim() &&
      !form.allergies.includes(form.allergyInput)
    ) {
      setForm({
        ...form,
        allergies: [...form.allergies, form.allergyInput], // ✅ Use correct key
        allergyInput: "", // ✅ Clear input after adding
      });
    }
  };

  const handleRemoveAllergy = (allergy) => {
    setForm({
      ...form,
      allergies: form.allergies.filter((item) => item !== allergy), // ✅ Use correct key
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form: ", form);

    if (form.userPassword !== form.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "bottom-right",
        autoClose: 4000,
      });
      return;
    }

    // Format data correctly for backend
    const formattedData = {
      firstName: form.name,
      userId: form.userId,
      password: form.userPassword,
      veganOptions: form.veganOptions,
      allergies: form.allergies,
      meatConsumption: form.meatConsumption, // Enum values
      fishConsumption: form.fishConsumption,
      vegetableConsumption: form.vegetableConsumption,
      spiciness: form.spiciness,
    };

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success("Sign up complete!", {
        position: "bottom-right",
        autoClose: 4000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Signup failed!", {
        position: "bottom-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <Container
      maxW="lg"
      centerContent
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minH="80vh"
    >
      <ToastContainer />
      <Heading mb={6} textAlign="center">
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>userId</FormLabel>
            <Input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="Enter userId"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="userPassword"
              value={form.userPassword}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Vegan Options (optional)</FormLabel>
            <RadioGroup
              name="vegan"
              value={form.vegan}
              onChange={(value) => handleSelectChange("vegan", value)}
            >
              <Stack direction="row">
                <Radio value="strict">Strict</Radio>
                <Radio value="lacto">Lacto</Radio>
                <Radio value="ovo">Ovo</Radio>
                <Radio value="pescatarian">Pescatarian</Radio>
                <Radio value="flexitarian">Flexitarian</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Allergies (optional)</FormLabel>
            <HStack>
              <Input
                placeholder="Add Allergy"
                name="allergyInput"
                value={form.allergyInput}
                onChange={handleChange}
              />
              <Button w={20} colorScheme="green" onClick={handleAddAllergy}>
                Add
              </Button>
            </HStack>
          </FormControl>
          {/* Allergies */}
          <HStack spacing={2} align="stretch">
            {form.allergies.length > 0 ? (
              form.allergies.map((allergy, index) => (
                <Flex
                  key={index}
                  bg="white"
                  p={2}
                  borderRadius="md"
                  shadow="xs"
                  justify="flex-start"
                  align="center"
                >
                  <Text fontSize="md">{allergy}</Text>
                  <CloseButton
                    size="sm"
                    onClick={() => handleRemoveAllergy(allergy)}
                  />
                </Flex>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                No allergies added
              </Text>
            )}
          </HStack>
          <FormControl isRequired>
            <FormLabel>Meat Consumption</FormLabel>
            <RadioGroup
              name="meatConsumption"
              value={form.meatConsumption}
              onChange={(value) => handleSelectChange("meatConsumption", value)}
            >
              <Stack direction="row">
                <Radio value="None">None</Radio>
                <Radio value="Low">Low</Radio>
                <Radio value="Moderate">Moderate</Radio>
                <Radio value="High">High</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Fish Consumption</FormLabel>
            <RadioGroup
              name="fishConsumption"
              value={form.fishConsumption}
              onChange={(value) => handleSelectChange("fishConsumption", value)}
            >
              <Stack direction="row">
                <Radio value="None">None</Radio>
                <Radio value="Low">Low</Radio>
                <Radio value="Moderate">Moderate</Radio>
                <Radio value="High">High</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vegetable Consumption</FormLabel>
            <RadioGroup
              name="vegetableConsumption"
              value={form.vegetableConsumption}
              onChange={(value) =>
                handleSelectChange("vegetableConsumption", value)
              }
            >
              <Stack direction="row">
                <Radio value="None">None</Radio>
                <Radio value="Low">Low</Radio>
                <Radio value="Moderate">Moderate</Radio>
                <Radio value="High">High</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          ;
          <FormControl isRequired>
            <FormLabel>Spiciness</FormLabel>
            <RadioGroup
              name="spiciness"
              value={form.spiciness}
              onChange={(value) => handleSelectChange("spiciness", value)}
            >
              <Stack direction="row">
                <Radio value="None">None</Radio>
                <Radio value="Mild">Mild</Radio>
                <Radio value="Medium">Medium</Radio>
                <Radio value="Spicy">Spicy</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Button type="submit" colorScheme="brand" width="full">
            Sign Up
          </Button>
        </VStack>
      </form>

      <HStack spacing={1} mt={4}>
        <Text>Already have an account?</Text>
        <Button variant="link" colorScheme="brand" as={RouterLink} to="/login">
          Login here
        </Button>
      </HStack>
    </Container>
  );
};

export default SignupPage;
