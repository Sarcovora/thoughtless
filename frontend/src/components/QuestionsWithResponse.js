import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
	Divider,
} from '@nextui-org/react';

const QuestionsWithResponse = ({selectedUser, questions, questionId}) => {
    return (
        <div className="px-4 py-2 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <Card>
                <CardHeader className="flex gap-3">
                    <h1 className="text-2xl">
                        Question {questionId+1}
                    </h1>
                </CardHeader>
                <CardBody>
					<h1 className='font-bold'>{questions[questionId]}</h1>
                <Divider className='mb-3 mt-3'/>
                    <p>{selectedUser.responses[questionId]}</p>
                </CardBody>
                {/* <Divider /> */}
                {/* <CardFooter></CardFooter> */}
            </Card>
        </div>
    );
}

export default QuestionsWithResponse;