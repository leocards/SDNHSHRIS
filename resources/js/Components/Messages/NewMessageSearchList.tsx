import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { ProfilePhoto } from "../ui/avatar";
import { usePopover } from "../ui/popover";
import { useMessage } from "@/Components/Provider/message-provider";
import { Messages2 } from "iconsax-react";
import TypographySmall from "../Typography";

const NewMessageSearchList = ({ search }: { search: string }) => {
    const { selectConversation } = useMessage();
    const { close } = usePopover();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        setLoading(true);
        window.axios
            .get(route("messages.search.new", {_query: { search }}))
            .then((response) => {
                let data = response.data;
                setList(data);
            })
            .finally(() => setLoading(false));
    }, [search]);

    return (
        <div className="grow h-full">
            {loading ? (
                <div className="flex flex-col items-center gap-4 mx-auto py-8 w-full">
                    <div className="loading loading-spinner loading-md"></div>
                    <TypographySmall>
                        Please wait a moment...
                    </TypographySmall>
                </div>
            ) : list.length === 0 && !loading ? (
                <div
                    className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit mx-auto pointer-events-none"
                >
                    <Messages2
                        variant="Bulk"
                        className="text-primary size-24 opacity-30 mx-auto"
                    />
                    <TypographySmall className="text-foreground/40 select-none">
                        No results found for "{search}"
                    </TypographySmall>
                </div>
            ) : (
                <div className="relative group overflow-y-auto max-h-[28.1rem]">
                    {MessagesListDummy.map((item, index) => (
                        <Card
                            key={index}
                            className="rounded-md shadow-none border-none hover:bg-secondary transition duration-150"
                            role="button"
                            onClick={() => {
                                selectConversation(item, true);
                                close();
                            }}
                        >
                            <CardContent className="flex items-center p-2 px-3 gap-3">
                                <div className="size-fit my-auto">
                                    <ProfilePhoto
                                        className="size-10"
                                        src={item?.avatar??''}
                                    />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-medium leading-5 line-clamp-1">
                                        {item?.full_name}
                                    </CardTitle>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewMessageSearchList;

const MessagesListDummy = [
    {
        "id": 2,
        "firstname": "MARIVENE",
        "lastname": "ESPINOSA",
        "middlename": "PIZON",
        "avatar": null,
        "name": "ESPINOSA, MARIVENE P.",
        "full_name": "MARIVENE P. ESPINOSA"
    },
    {
        "id": 3,
        "firstname": "ALCE",
        "lastname": "GOMEZ",
        "middlename": "LUZON",
        "avatar": null,
        "name": "GOMEZ, ALCE L.",
        "full_name": "ALCE L. GOMEZ"
    },
    {
        "id": 4,
        "firstname": "REYNIEL",
        "lastname": "CASTAÑARES",
        "middlename": "VILLASENCIO",
        "avatar": "/storage/avatar/vTvO85w4Qyx91y4wGoVHAuTEOc70DaLFcRgffn4W.jpg",
        "name": "CASTAÑARES, REYNIEL V.",
        "full_name": "REYNIEL V. CASTAÑARES"
    },
    {
        "id": 6,
        "firstname": "DIANNE",
        "lastname": "JACINTO",
        "middlename": "HERNANDEZ",
        "avatar": null,
        "name": "JACINTO, DIANNE H.",
        "full_name": "DIANNE H. JACINTO"
    },
    {
        "id": 7,
        "firstname": "JOANALLE",
        "lastname": "PAMA",
        "middlename": "PACATANG",
        "avatar": null,
        "name": "PAMA, JOANALLE P.",
        "full_name": "JOANALLE P. PAMA"
    },
    {
        "id": 8,
        "firstname": "APPLE JEAN",
        "lastname": "NAVARES",
        "middlename": "DAQUIO",
        "avatar": null,
        "name": "NAVARES, APPLE JEAN D.",
        "full_name": "APPLE JEAN D. NAVARES"
    },
    {
        "id": 9,
        "firstname": "MARY JOY",
        "lastname": "PALMA",
        "middlename": "COJO",
        "avatar": null,
        "name": "PALMA, MARY JOY C.",
        "full_name": "MARY JOY C. PALMA"
    },
    {
        "id": 10,
        "firstname": "FLORAMIE",
        "lastname": "LOPEZ",
        "middlename": "DUHINO",
        "avatar": null,
        "name": "LOPEZ, FLORAMIE D.",
        "full_name": "FLORAMIE D. LOPEZ"
    },
    {
        "id": 11,
        "firstname": "ELARDE",
        "lastname": "ABAYA",
        "middlename": "HIBAYA",
        "avatar": null,
        "name": "ABAYA, ELARDE H.",
        "full_name": "ELARDE H. ABAYA"
    },
    {
        "id": 12,
        "firstname": "ERWIN",
        "lastname": "AGUDO",
        "middlename": "P",
        "avatar": null,
        "name": "AGUDO, ERWIN P.",
        "full_name": "ERWIN P. AGUDO"
    },
    {
        "id": 13,
        "firstname": "DAVIE ROSE",
        "lastname": "MORALES",
        "middlename": "BALUG",
        "avatar": null,
        "name": "MORALES, DAVIE ROSE B.",
        "full_name": "DAVIE ROSE B. MORALES"
    },
    {
        "id": 14,
        "firstname": "Karl",
        "lastname": "Alaba",
        "middlename": "Caballero",
        "avatar": null,
        "name": "Alaba, Karl C.",
        "full_name": "Karl C. Alaba"
    },
    {
        "id": 15,
        "firstname": "ROCHIL",
        "lastname": "BANSAG",
        "middlename": "TANUDRA",
        "avatar": null,
        "name": "BANSAG, ROCHIL T.",
        "full_name": "ROCHIL T. BANSAG"
    },
    {
        "id": 16,
        "firstname": "JUNNRY",
        "lastname": "BARLUSCA",
        "middlename": "CABALLERO",
        "avatar": null,
        "name": "BARLUSCA, JUNNRY C.",
        "full_name": "JUNNRY C. BARLUSCA"
    },
    {
        "id": 17,
        "firstname": "KRISMIE",
        "lastname": "BASTIAN",
        "middlename": "HERNANDEZ",
        "avatar": null,
        "name": "BASTIAN, KRISMIE H.",
        "full_name": "KRISMIE H. BASTIAN"
    },
    {
        "id": 18,
        "firstname": "MERYLL",
        "lastname": "DULARTE",
        "middlename": "DE GUZMAN",
        "avatar": null,
        "name": "DULARTE, MERYLL D.",
        "full_name": "MERYLL D. DULARTE"
    },
    {
        "id": 19,
        "firstname": "SARAH JANE",
        "lastname": "OMBLERO",
        "middlename": "REMETICADO",
        "avatar": null,
        "name": "OMBLERO, SARAH JANE R.",
        "full_name": "SARAH JANE R. OMBLERO"
    },
    {
        "id": 20,
        "firstname": "JANICE",
        "lastname": "QUIBO",
        "middlename": "ARCADIO",
        "avatar": null,
        "name": "QUIBO, JANICE A.",
        "full_name": "JANICE A. QUIBO"
    },
    {
        "id": 21,
        "firstname": "DEITHER",
        "lastname": "SANGILAN",
        "middlename": "ESPINO",
        "avatar": null,
        "name": "SANGILAN, DEITHER E.",
        "full_name": "DEITHER E. SANGILAN"
    },
    {
        "id": 22,
        "firstname": "ALMA DONNA",
        "lastname": "TASIC",
        "middlename": "LOBIA",
        "avatar": null,
        "name": "TASIC, ALMA DONNA L.",
        "full_name": "ALMA DONNA L. TASIC"
    },
    {
        "id": 23,
        "firstname": "JASMIN",
        "lastname": "YBAÑEZ",
        "middlename": "PINEDA",
        "avatar": null,
        "name": "YBAÑEZ, JASMIN P.",
        "full_name": "JASMIN P. YBAÑEZ"
    },
    {
        "id": 24,
        "firstname": "REYMUND",
        "lastname": "VERTUDES",
        "middlename": "ARCENA",
        "avatar": null,
        "name": "VERTUDES, REYMUND A.",
        "full_name": "REYMUND A. VERTUDES"
    },
    {
        "id": 25,
        "firstname": "CRISTINE",
        "lastname": "TUBOSO",
        "middlename": "GOMEZ",
        "avatar": null,
        "name": "TUBOSO, CRISTINE G.",
        "full_name": "CRISTINE G. TUBOSO"
    },
    {
        "id": 26,
        "firstname": "APRIL JOEY",
        "lastname": "TUBAC",
        "middlename": "ALIBO",
        "avatar": null,
        "name": "TUBAC, APRIL JOEY A.",
        "full_name": "APRIL JOEY A. TUBAC"
    },
    {
        "id": 27,
        "firstname": "BELEN",
        "lastname": "TINASAS",
        "middlename": "REYNO",
        "avatar": null,
        "name": "TINASAS, BELEN R.",
        "full_name": "BELEN R. TINASAS"
    },
    {
        "id": 28,
        "firstname": "ANNE CLARENCE",
        "lastname": "TAGPUNO",
        "middlename": null,
        "avatar": null,
        "name": "TAGPUNO, ANNE CLARENCE",
        "full_name": "ANNE CLARENCE TAGPUNO"
    },
    {
        "id": 29,
        "firstname": "FRANPERL",
        "lastname": "TABLATE",
        "middlename": "LAGAYLAY",
        "avatar": null,
        "name": "TABLATE, FRANPERL L.",
        "full_name": "FRANPERL L. TABLATE"
    },
    {
        "id": 30,
        "firstname": "AIRES JANE",
        "lastname": "SUMAGAYSAY",
        "middlename": "DUCA",
        "avatar": null,
        "name": "SUMAGAYSAY, AIRES JANE D.",
        "full_name": "AIRES JANE D. SUMAGAYSAY"
    },
    {
        "id": 31,
        "firstname": "AHDEL",
        "lastname": "MACABULOS",
        "middlename": "BALIGOD",
        "avatar": null,
        "name": "MACABULOS, AHDEL B.",
        "full_name": "AHDEL B. MACABULOS"
    }
]
