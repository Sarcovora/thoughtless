import React from 'react';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Select,
    SelectItem,
} from '@nextui-org/react';

const SelectDataType = ({ dataName, orgDetails, setOrgDetails }) => {
    const handleChange = (newValue) => {
        // Update the orgDetails state with the new type for the given dataName
        const updatedDetails = {
            ...orgDetails, // Spread the existing details
            [dataName]: newValue, // Update the value for the specific dataName
        };
        setOrgDetails(updatedDetails); // Set the new orgDetails state in the parent component
		// console.log("New Org Details: ")
		// console.log(updatedDetails)
    };

    return (
        <Select
            label="Data Type"
            placeholder="Please select one"
            selectionMode="single"
            defaultSelectedKeys={['question']}
            className="max-w-xs"
			isRequired={true}
			onChange={(e) => handleChange(e.target.value)}
        >
            <SelectItem key="question" value="question">
                Question Field (default option)
            </SelectItem>
            <SelectItem key="name" value="name">
                Name Field (one per set of data)
            </SelectItem>
            <SelectItem key="link" value="link">
                Hyperlink Field (eg. github, linkedin...)
            </SelectItem>
            <SelectItem key="info" value="info">
                Info Field (eg. email, phone number...)
            </SelectItem>
            <SelectItem key="linkInfo" value="linkInfo">
                Hyperlink &amp; Info Field
            </SelectItem>
        </Select>
    );
};

export default SelectDataType;
