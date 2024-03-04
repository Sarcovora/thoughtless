import React from 'react';
import { Card, Spacer, Button, Input, Row, Checkbox } from '@nextui-org/react';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

export default function Signup() {
    return (
        <div>
            <NavigationBar />
            <MaxWidthWrapper>
                <h1 className="text-4xl font-bold text-center mt-10">
                    Signup?
                </h1>
                <p className="py-2 font-light">Why? You're already here!</p>
            </MaxWidthWrapper>
        </div>
    );
}
