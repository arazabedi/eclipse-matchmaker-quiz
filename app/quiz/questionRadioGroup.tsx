import React from 'react';
import { questionsObject } from './questionsObject'; // Assuming questionsObject is imported from another file

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuestionRadioGroupProps {
    questionNumber: string;
    onChange: (value: string) => void;
    value: string;
}

const QuestionRadioGroup: React.FC<QuestionRadioGroupProps> = ({ questionNumber, onChange, value }) => {
    const question = questionsObject[questionNumber];

    return (
        <RadioGroup
            onValueChange={onChange}
            defaultValue={value}
            className="flex flex-col space-y-1"
        >
            {question.answers.map((answer, index) => (
                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                        <RadioGroupItem value={answer} />
                    </FormControl>
                    <FormLabel className="font-normal">
                        {answer}
                    </FormLabel>
                </FormItem>
            ))}
        </RadioGroup>
    );
};

export default QuestionRadioGroup;
