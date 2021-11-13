/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePatient = /* GraphQL */ `
  subscription OnCreatePatient {
    onCreatePatient {
      id
      firstName
      lastName
      insuranceNumber
      ssn
      birthDate
      phone
      address
      sex
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePatient = /* GraphQL */ `
  subscription OnUpdatePatient {
    onUpdatePatient {
      id
      firstName
      lastName
      insuranceNumber
      ssn
      birthDate
      phone
      address
      sex
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePatient = /* GraphQL */ `
  subscription OnDeletePatient {
    onDeletePatient {
      id
      firstName
      lastName
      insuranceNumber
      ssn
      birthDate
      phone
      address
      sex
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDoctor = /* GraphQL */ `
  subscription OnCreateDoctor {
    onCreateDoctor {
      id
      firstName
      lastName
      phone
      address
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDoctor = /* GraphQL */ `
  subscription OnUpdateDoctor {
    onUpdateDoctor {
      id
      firstName
      lastName
      phone
      address
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDoctor = /* GraphQL */ `
  subscription OnDeleteDoctor {
    onDeleteDoctor {
      id
      firstName
      lastName
      phone
      address
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePrescription = /* GraphQL */ `
  subscription OnCreatePrescription {
    onCreatePrescription {
      id
      appointmentId
      patientId
      fileName
      description
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePrescription = /* GraphQL */ `
  subscription OnUpdatePrescription {
    onUpdatePrescription {
      id
      appointmentId
      patientId
      fileName
      description
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePrescription = /* GraphQL */ `
  subscription OnDeletePrescription {
    onDeletePrescription {
      id
      appointmentId
      patientId
      fileName
      description
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAppointment = /* GraphQL */ `
  subscription OnCreateAppointment {
    onCreateAppointment {
      id
      patientId
      doctorId
      appointmentDate
      appointmentTime
      description
      patient {
        id
        firstName
        lastName
        insuranceNumber
        ssn
        birthDate
        phone
        address
        sex
        createdAt
        updatedAt
      }
      doctor {
        id
        firstName
        lastName
        phone
        address
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAppointment = /* GraphQL */ `
  subscription OnUpdateAppointment {
    onUpdateAppointment {
      id
      patientId
      doctorId
      appointmentDate
      appointmentTime
      description
      patient {
        id
        firstName
        lastName
        insuranceNumber
        ssn
        birthDate
        phone
        address
        sex
        createdAt
        updatedAt
      }
      doctor {
        id
        firstName
        lastName
        phone
        address
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAppointment = /* GraphQL */ `
  subscription OnDeleteAppointment {
    onDeleteAppointment {
      id
      patientId
      doctorId
      appointmentDate
      appointmentTime
      description
      patient {
        id
        firstName
        lastName
        insuranceNumber
        ssn
        birthDate
        phone
        address
        sex
        createdAt
        updatedAt
      }
      doctor {
        id
        firstName
        lastName
        phone
        address
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
