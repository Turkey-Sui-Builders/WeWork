// src/components/CreateJobModal.tsx
import {
  Dialog,
  Flex,
  Text,
  Button,
  TextField,
  TextArea,
} from "@radix-ui/themes";
import { useState } from "react";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    freelancer: string;
    description: string;
    price: string;
    duration: string;
  }) => void;
  isCreating: boolean;
}

export function CreateJobModal({
  open,
  onOpenChange,
  onSubmit,
  isCreating,
}: CreateJobModalProps) {
  const [freelancer, setFreelancer] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(""); // In days

  const handleSubmit = () => {
    // Basic validation
    if (!freelancer || !description || !price || !duration) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({ freelancer, description, price, duration });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Post a New Job</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Define the job details to post it on-chain.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Freelancer Address
            </Text>
            <TextField.Root
              placeholder="0x..."
              value={freelancer}
              onChange={(e) => setFreelancer(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Job Description URL
            </Text>
            <TextArea
              placeholder="https://gist.github.com/..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Price (in SUI)
            </Text>
            <TextField.Root
              type="number"
              placeholder="e.g., 100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Duration (in Days)
            </Text>
            <TextField.Root
              type="number"
              placeholder="e.g., 7"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={isCreating}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Posting..." : "Post Job"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
