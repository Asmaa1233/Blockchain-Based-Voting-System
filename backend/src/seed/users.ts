type UserType = {
  name: string;
  id: string;
  role: string;
  email: string;
  password: string;
  verified: boolean;
};

const users: UserType[] = [
  {
    name: "John",
    id: "21657893",
    role: "Evidence Room Officer",
    email: "john@bcoc.com",
    password: "$2a$10$JfYG3JXqx5S79j2i/JfWiONCnr/b7I0p0Fj0fK7USM6v5DBsFntXu",
    verified: true,
  },
  {
    name: "Asma",
    id: "19284703",
    role: "Investigator",
    email: "asma@bcoc.com",
    password: "$2a$10$bp2XlmDIV08M.mW7vzNE2u0mZl1olzBbKUou/5lNEaAho.Hy0xP62",
    verified: true,
  },
  {
    name: "Najla",
    id: "45638533",
    role: "Defence Attorney",
    email: "najla@bcoc.com",
    password: "$2a$10$Mbq1VSFzGSTn0w59h.ZcE.Is/gr775AiqijHKIGVsLN.U75N1RdvK",
    verified: true,
  },

  {
    name: "Mariam",
    id: "49653790",
    role: "Prosecutor Attorney",
    email: "mariam@bcoc.com",
    password: "$2a$10$wpPujJkt0CpVAAoHZD7K9eMq52F2Dra0Jqm6xQfiZyM9hXQd85flm",
    verified: true,
  },

  {
    name: "Yaser",
    id: "34903238",
    role: "CSI",
    email: "yaser@bcoc.com",
    password: "$2a$10$8L68erm7O/sZzYtxTGxthefeI4SomRwHr/OdOVWJIvWx.SXpUCUfO",
    verified: true,
  },

  {
    name: "Ben",
    id: "45095329",
    role: "Evidence Room Officer",
    email: "ben@bcoc.com",
    password: "$2a$10$5q7Fqps0ir/mfRoTyR1E3.vZdrUqBOPsVeeAgrSPMcwnDwQglDLSC",
    verified: true,
  },

];


export default users;
