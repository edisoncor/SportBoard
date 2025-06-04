from dataclasses import dataclass

TOKEN_TYPE_CHOICE = (
    ("ACCOUNT_VERIFICATION", "ACCOUNT_VERIFICATION"),
    ("PASSWORD_RESET", "PASSWORD_RESET"),
)

ROLE_CHOICE = (
    ("SUPERADMIN", "SUPERADMIN"),
    ("ADMIN", "ADMIN"),
    ("COORDINATOR", "COORDINATOR"),
    ("COACH", "COACH"),
    ("ATHLETE", "ATHLETE"),
    ("ESPECTATOR", "ESPECTATOR"),
    ("REFEREE", "REFEREE"),

)

@dataclass
class TokenEnum:
    """
    Enum class for token types used in the application.
    
    Attributes:
        ACCOUNT_VERIFICATION (str): Token type for account verification.
        PASSWORD_RESET (str): Token type for password reset.
    """
    ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION"
    PASSWORD_RESET = "PASSWORD_RESET"


@dataclass
class SystemRoleEnum:
    """
    Enum class for system roles used in the application.
    
    Attributes:
        SUPERADMIN (str): Role with full system access.
        ADMIN (str): Role with administrative access.
        COORDINATOR (str): Role for coordination activities.
        COACH (str): Role for coaching staff.
        ATHLETE (str): Role for athletes.
        ESPECTATOR (str): Role for spectators with limited access.
        REEFEREE (str): Role for referees.
    """
    SUPERADMIN = "SUPERADMIN"
    ADMIN = "ADMIN"
    COORDINATOR = "COORDINATOR"
    COACH = "COACH"
    ATHLETE = "ATHLETE"
    ESPECTATOR = "ESPECTATOR"
    REEFEREE = "REFEREE"
