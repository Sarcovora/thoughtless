import React from 'react';
import { Card, Spacer, Button, Input, Row, Checkbox } from '@nextui-org/react';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavigationBar from './Navigation';

export default function Login() {
    return (
        <div>
			<NavigationBar/>
            <MaxWidthWrapper></MaxWidthWrapper>
        </div>
    );
}
