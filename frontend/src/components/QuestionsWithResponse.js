import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
	Divider,
} from '@nextui-org/react';

const QuestionsWithResponse = ({selectedUser, questionId}) => {
    return (
        <div className="px-4 py-2 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <Card>
                <CardHeader className="flex gap-3">
                    <h1 className="text-2xl">
                        Question {questionId}
                    </h1>
                </CardHeader>
                <CardBody>
					<h1 className='font-bold'>QUESTION HERE::: UHHH HOW DO YOU LIKE THIS???</h1>
                <Divider className='mb-3 mt-3'/>
                    <p>{selectedUser.name} response to this question</p>
                </CardBody>
                {/* <Divider /> */}
                {/* <CardFooter></CardFooter> */}
            </Card>
        </div>
    );
}

export default QuestionsWithResponse;