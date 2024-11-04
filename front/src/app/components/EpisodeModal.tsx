import { Button, Checkbox, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from "@chakra-ui/react";
import dayjs from "dayjs";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";

interface Character {
    id: number;
    name: string;
}

interface EpisodeData {
    title: string;
    number: number;
    releaseDate: string;
    description: string;
    heard: boolean;
    caseNumber: string;
    season: number;
    characterIds: number[];
}

interface EpisodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    characters: Character[];
    onSubmit: (data: EpisodeData) => void;
    initialValue?: EpisodeData | null;
}

const EpisodeModal: React.FC<EpisodeModalProps> = ({ isOpen, onClose, characters, onSubmit, initialValue }) => {
    const [ title, setTitle ] = useState<string>(initialValue?.title || "");
    const [ number, setNumber ] = useState<number>(initialValue?.number || 0);
    const [ releaseDate, setReleaseDate ] = useState<string>(initialValue?.releaseDate || "");
    const [ description, setDescription ] = useState<string>(initialValue?.description || "");
    const [ heard, setHeard ] = useState<boolean>(initialValue?.heard || false);
    const [ caseNumber, setCaseNumber] = useState<string>(initialValue?.caseNumber || "");
    const [ season, setSeason ] = useState<number>(initialValue?.season || 1);
    const [ selectedCharacter, setSelectedCharacter ] = useState<number[]>(initialValue?.characterIds || []);
    const characterOptions = characters.map((character) => ({
        value: character.id,
        label: character.name,
    }));

    useEffect(() => {
        if(initialValue) {
            setTitle(initialValue.title);
            setNumber(initialValue.number);
            setReleaseDate(initialValue.releaseDate);
            setDescription(initialValue.description);
            setHeard(initialValue.heard);
            setCaseNumber(initialValue.caseNumber);
            setSeason(initialValue.season);
            setSelectedCharacter(initialValue.characterIds);
        }
    }, [initialValue]);

    const handleSubmit = () => {
        const data: EpisodeData = {
            title,
            number,
            releaseDate: dayjs(releaseDate, 'YYYY-MM-DD').toISOString(),
            description,
            heard,
            caseNumber,
            season,
            characterIds: selectedCharacter,
        };
        onSubmit(data);
        onClose();
    };

    const handleCharacterChange = (selectedOptions: any) => {
        setSelectedCharacter(selectedOptions ? selectedOptions.map((option:any) => option.value) : []);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{initialValue ? "Edit Episode" : "Upload Episode"}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder="Episode title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <FormLabel>Episode Number</FormLabel>
                        <Input placeholder="Episode number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))} type="number" min={1}/>
                        <FormLabel>Season</FormLabel>
                        <Input placeholder="Episode season" value={season} onChange={(e) => setSeason(parseInt(e.target.value))} type="number" min={1}/>
                        <FormLabel>Case #</FormLabel>
                        <Input placeholder="Case number" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)}/>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder="Case description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                        <FormLabel>Release Date</FormLabel>
                        <Input placeholder="Release date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} type="date" />
                        <FormLabel>Characters in Episode</FormLabel>
                        <ReactSelect
                            options={characterOptions}
                            placeholder="Character appearences..."
                            isMulti // TODO: verificar que pasa si creo personajes al crear un episodio y enumero otros personajes también, un desastre seguro
                            onChange={handleCharacterChange}
                            value={characterOptions.filter(option => selectedCharacter.includes(option.value))}
                        />
                        <FormLabel>Heard Episode </FormLabel>
                        <Checkbox isChecked={heard} onChange={(e) => setHeard(e.target.checked)}></Checkbox>                    
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        {initialValue ? "Update" : "Upload"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EpisodeModal;