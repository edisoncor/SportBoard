from dataclasses import dataclass


@dataclass
class PERMISSIONS:
    ViewTransaction = "ViewTransaction"
    GenerateReport = "GenerateReport"

    #institution
    ViewInstitution = "ViewInstitution"
    CreateInstitution = "CreateInstitution"
    UpdateInstitution = "UpdateInstitution"
    DeleteInstitution = "DeleteInstitution"
    
    #administration
    ViewAdministration = "ViewAdministration"
    CreateAdministration = "CreateAdministration"
    UpdateAdministration = "UpdateAdministration"
    DeleteAdministration = "DeleteAdministration"
    
    #department
    ViewDepartment = "ViewDepartment"
    CreateDepartment = "CreateDepartment"
    UpdateDepartment = "UpdateDepartment"
    DeleteDepartment = "DeleteDepartment"
    
    #health
    ViewHealth = "ViewHealth"
    CreateHealth = "CreateHealth"
    UpdateHealth = "UpdateHealth"
    DeleteHealth = "DeleteHealth"

    

    #performance
    ViewPerformance = "ViewPerformance"
    CreatePerformance = "CreatePerformance"
    UpdatePerformance = "UpdatePerformance"
    DeletePerformance = "DeletePerformance"

    #sportprofile
    ViewSportProfile = "ViewSportProfile"
    CreateSportProfile = "CreateSportProfile"
    UpdateSportProfile = "UpdateSportProfile"
    DeleteSportProfile = "DeleteSportProfile"