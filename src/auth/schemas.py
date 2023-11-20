from pydantic import BaseModel
from typing import Optional, Union
from sqlmodel import SQLModel, Field, Relationship, Column, VARCHAR
from passlib.context import CryptContext
from fastapi.security import OAuth2
from fastapi.security.base import SecurityBase
from fastapi.security.utils import get_authorization_scheme_param
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from starlette.requests import Request
from typing import Optional, List
from fastapi import HTTPException
import datetime

pwd_context = CryptContext(schemes="bcrypt")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None
    expires: Optional[datetime.datetime]

class OAuth2PasswordBearerCookie(OAuth2): # https://nilsdebruin.medium.com/fastapi-how-to-add-basic-and-cookie-authentication-a45c85ef47d3
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str = None,
        scopes: dict = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        header_authorization: str = request.headers.get("access_token")
        cookie_authorization: str = request.cookies.get("access_token")

        header_scheme, header_param = get_authorization_scheme_param(
            header_authorization
        )
        cookie_scheme, cookie_param = get_authorization_scheme_param(
            cookie_authorization
        )

        if header_scheme.lower() == "bearer":
            authorization = True
            scheme = header_scheme
            param = header_param

        elif cookie_scheme.lower() == "bearer":
            authorization = True
            scheme = cookie_scheme
            param = cookie_param

        else:
            authorization = False

        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                # raise HTTPException(
                #     status_code=HTTP_403_FORBIDDEN, detail="Not authenticated"
                # )
                raise HTTPException(status_code=302, detail="Not authorized", headers = {"Location": "/"} )
            else:
                return None
        return param


