export interface Profile {
    id: string;
    userId: string;
    fullName: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    profilePictureUrl?: string;
    professionalSummary?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Education {
    id: string;
    profileId: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
    description?: string;
    createdAt: string;
}

export interface WorkExperience {
    id: string;
    profileId: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements: string[];
    createdAt: string;
}

export interface Skill {
    id: string;
    profileId: string;
    name: string;
    category?: string;
    proficiencyLevel?: string;
    createdAt: string;
}

export interface Project {
    id: string;
    profileId: string;
    name: string;
    description?: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
    startDate?: string;
    endDate?: string;
    createdAt: string;
}

export interface Certification {
    id: string;
    profileId: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    createdAt: string;
}

export interface Language {
    id: string;
    profileId: string;
    name: string;
    proficiency?: string;
    createdAt: string;
}

export interface JobPosting {
    id: string;
    userId: string;
    jobTitle: string;
    company?: string;
    jobUrl?: string;
    jobDescription: string;
    requiredSkills?: string[];
    experienceLevel?: string;
    keywords?: string[];
    createdAt: string;
}

export interface GeneratedCvContent {
    professionalSummary: string;
    workExperience: {
        company: string;
        position: string;
        location?: string;
        startDate: string;
        endDate?: string;
        description: string;
        achievements: string[];
    }[];
    education: {
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate: string;
        endDate?: string;
        gpa?: number;
        description?: string;
    }[];
    skills: {
        name: string;
        category?: string;
        proficiencyLevel?: string;
    }[];
    projects: {
        name: string;
        description?: string;
        technologies: string[];
        url?: string;
        githubUrl?: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        issueDate: string;
        expiryDate?: string;
    }[];
    languages: {
        name: string;
        proficiency?: string;
    }[];
    sectionTitles?: {
        professionalSummary: string;
        workExperience: string;
        education: string;
        skills: string;
        projects: string;
        certifications: string;
        languages: string;
    };
}

export interface GeneratedCV {
    id: string;
    userId: string;
    profileId: string;
    jobPostingId?: string;
    generatedContent: GeneratedCvContent | null;
    pdfUrl?: string;
    pdfStoragePath?: string;
    includeProfilePicture?: boolean;
    cvSpecificPhotoUrl?: string;
    tone?: string;
    generationStatus: 'pending' | 'completed' | 'failed';
    aiModelUsed?: string;
    templateName?: string;
    createdAt: string;
    updatedAt?: string;
    jobPosting?: {
        jobTitle: string;
        company: string;
    };
    profile?: Profile;
}
