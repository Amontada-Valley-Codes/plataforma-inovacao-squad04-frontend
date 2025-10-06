export type Challenge = {
  id: number;
  ChallengeTitle: string;
  Author: string;
  Category: string;
  Status: string;
  Date: string;
  Visibility: string;
  companyId?: number; // opcional, para vincular a uma empresa
};

export const challengesData: Challenge[] = [
  {
    id: 1,
    ChallengeTitle: "Build a Todo App",
    Author: "Eduardo Albuquerque",
    Category: "Front-End",
    Status: "Completed",
    Date: "2025-09-17",
    Visibility: "Public",
    companyId: 1,
  },
  {
    id: 2,
    ChallengeTitle: "API RESTful com NestJS",
    Author: "João Silva",
    Category: "Back-End",
    Status: "In Progress",
    Date: "2025-09-12",
    Visibility: "Private",
    companyId: 1,
  },
  {
    id: 3,
    ChallengeTitle: "UI Dashboard com Tailwind",
    Author: "Maria Souza",
    Category: "Design/UI",
    Status: "Pending",
    Date: "2025-09-01",
    Visibility: "Public",
    companyId: 2,
  },
  {
    id: 4,
    ChallengeTitle: "Mobile App React Native",
    Author: "Carlos Lima",
    Category: "Mobile",
    Status: "Completed",
    Date: "2025-08-28",
    Visibility: "Private",
    companyId: 3,
  },
  {
    id: 5,
    ChallengeTitle: "GraphQL API",
    Author: "Ana Paula",
    Category: "Back-End",
    Status: "Pending",
    Date: "2025-09-05",
    Visibility: "Public",
    companyId: 2,
  },
  {
    id: 6,
    ChallengeTitle: "Landing Page HTML/CSS",
    Author: "Rafael Santos",
    Category: "Front-End",
    Status: "In Progress",
    Date: "2025-09-10",
    Visibility: "Public",
    companyId: 5,
  },
  {
    id: 7,
    ChallengeTitle: "E-commerce Fullstack",
    Author: "Luiza Martins",
    Category: "Fullstack",
    Status: "Completed",
    Date: "2025-08-20",
    Visibility: "Private",
    companyId: 4,
  },
  {
    id: 8,
    ChallengeTitle: "Chat App Socket.io",
    Author: "Bruno Costa",
    Category: "Back-End",
    Status: "In Progress",
    Date: "2025-09-14",
    Visibility: "Public",
    companyId: 3,
  },
];
