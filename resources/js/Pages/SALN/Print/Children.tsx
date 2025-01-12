import React from "react";
import { PAGE } from "../Types/type";
import { format } from "date-fns";

type Props = {
    children: PAGE['children']
}

const Children: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <div className="grid grid-cols-[1fr,12rem,10rem] font-bold uppercase gap-4 text-center text-[8pt]">
                <div>Name</div>
                <div>Date of Birth</div>
                <div>Age</div>
            </div>
            <div className="tetx-[10pt]">
                {children ? (
                    children.map((child, index) => (
                        <Card key={index} children={child} />
                    ))
                ) : (
                    Array.from({ length: 4 }).map((_, index) => <Card key={index} />)
                )}
            </div>
        </div>
    );
};

const Card: React.FC<{children?: {
    name: string
    dateofbirth: string
}}> = ({ children }) => {
    function calculateAge(birthdate: string): number {
        // Parse the birthdate string into a Date object
        const birthDate = new Date(birthdate);

        // Get today's date
        const today = new Date();

        // Calculate the age
        let age = today.getFullYear() - birthDate.getFullYear();

        // Adjust age if the birthday hasn't occurred yet this year
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
            age--;
        }

        return age;
    }

    return (
        <div
            className="grid grid-cols-[1fr,12rem,10rem] h-5 gap-4 text-center [&>div]:border-b [&>div]:border-black [&>div]:leading-5"
        >
            <div>{children?.name||"N/A"}</div>
            <div>{children?.dateofbirth?format(children?.dateofbirth, "MM/dd/y"):"N/A"}</div>
            <div>{(children?.dateofbirth ? calculateAge(children?.dateofbirth) :null)||"N/A"}</div>
        </div>
    )
}

export default Children;
