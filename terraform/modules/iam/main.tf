data "aws_iam_policy" "AmazonSSMReadOnlyAccess" {
  arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

data "aws_iam_policy" "AmazonECSTaskExecutionRolePolicy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name = "ecsTaskExecutionRole_${var.env}"

  inline_policy {
    name   = "sm_readSecret"
    policy = jsonencode({
    Statement = [{
      Action   = "secretsmanager:GetSecretValue"
      Effect   = "Allow"
      Resource = "${var.ssm_arn}"
      Sid      = "VisualEditor0"
    }]
    Version   = "2012-10-17"
    })
  }

  inline_policy {
    name   = "ecsTaskGetS3Permissions"
    policy = jsonencode({
      Statement = [{
        Action   = [
          "s3:GetObject",
        ]
        Effect   = "Allow"
        Resource = [
          var.env == "prod" ? "arn:aws:s3:::fromeroad/.env" : "arn:aws:s3:::fromeroad/.dev.env",
        ]},
        {
          Action   = [
            "s3:GetBucketLocation",
          ]
          Effect   = "Allow"
          Resource = [
            "arn:aws:s3:::fromeroad",
          ]
      }]
      Version   = "2008-10-17"
    })
  }

  assume_role_policy = jsonencode({
    Version = "2008-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_ssm_read_only" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = data.aws_iam_policy.AmazonSSMReadOnlyAccess.arn
}

resource "aws_iam_role_policy_attachment" "attach_ecs_execution" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = data.aws_iam_policy.AmazonECSTaskExecutionRolePolicy.arn
}


resource "aws_iam_user" "S3_USER" {
  name = "fr_S3_USER_${var.env}"
}

resource "aws_iam_user" "SES_USER" {
  name = "fr_SES_USER_${var.env}"
}

resource "aws_iam_user_policy" "S3_policy" {
  user   = aws_iam_user.S3_USER.name
  name   = "s3_readwrite_policy"
  policy = jsonencode({
  Statement = [{
    Effect = "Allow",
    Action = [
        "s3:ListAllMyBuckets"
    ],
    Resource = "arn:aws:s3:::fromeroad-*"
  },
  {
    Effect = "Allow",
    Action = [
      "s3:ListBucket",
      "s3:GetBucketLocation"
    ],
    Resource = "arn:aws:s3:::fromeroad-*"
  },
  {
    Effect = "Allow",
    Action = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:DeleteObject"
    ],
    Resource = "arn:aws:s3:::fromeroad-*/*"
  }]
  Version   = "2012-10-17"
  })
}

resource "aws_iam_user_policy" "SES_policy" {
  user   = aws_iam_user.SES_USER.name
  name   = "ses_sendemail"
  policy = jsonencode({
  Statement = [
    {
      Sid = "VisualEditor0",
      Effect = "Allow",
      Action = "ses:SendRawEmail",
      Resource = "*"
    }
  ]
  Version   = "2012-10-17"
  })
}

resource "aws_iam_access_key" "S3_KEY" {
  user = aws_iam_user.S3_USER.name
}
resource "aws_iam_access_key" "SES_KEY" {
  user = aws_iam_user.SES_USER.name
}