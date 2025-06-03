from dataclasses import dataclass


@dataclass
class PERMISSIONS:
    f"""
    Dataclass que define todas las constantes de permisos utilizadas en la aplicación.
    Esta clase contiene constantes de tipo string para todos los permisos que pueden ser asignados a roles.
    Los permisos están organizados por áreas funcionales (transacciones, instituciones, departamentos, etc.)
    y siguen un patrón de nomenclatura consistente: Acción + Entidad (por ejemplo, ViewInstitution, CreateHealth).
    """
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