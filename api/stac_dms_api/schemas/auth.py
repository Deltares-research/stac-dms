from marshmallow import Schema, fields


class HTTPAuthExceptionSchema(Schema):
    code = fields.String(metadata={"example": "invalid_header"})
    description = fields.String(
        metadata={"example": "Unable to parse authorization token."}
    )
