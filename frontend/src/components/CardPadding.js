import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
} from '@nextui-org/react';

const CardPadding = () => {
    return (
        <div className="px-4 py-2 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <Card shadow="none">
                <CardHeader className="flex gap-3"></CardHeader>
                <CardBody>
				</CardBody>
                <CardFooter></CardFooter>
            </Card>
        </div>
    );
};

export default CardPadding;
