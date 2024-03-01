import { Slider, Textarea } from '@nextui-org/react';

export default function RubricRatings() {
    return (
        <>
            <Slider
                size="md"
                step={1}
                color="foreground"
                label="Response rating"
                showSteps={false}
                maxValue={5}
                minValue={1}
                defaultValue={3}
                className="max-w-md"
            />
            <Textarea
                minRows={1}
                maxRows={3}
                variant={'flat'}
                label="Comments"
                labelPlacement="outside"
                placeholder="Additional comments"
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
            />
        </>
    );
}
