import React from 'react';
import { Card, Spacer, Button, Input, Row, Checkbox } from '@nextui-org/react';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

export default function Login() {
    return (
        <div>
            <NavigationBar />
            <MaxWidthWrapper>
                <h1 className="text-4xl font-bold text-center mt-10">
                    You're here to login?
                </h1>
                <p className="py-2 font-light">
					Well, congrats! We don't have a login page so I guess you're good to go!
                </p>
                <p className="font-bold">:))</p>
            </MaxWidthWrapper>
        </div>
    );
}
