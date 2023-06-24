terraform {
  required_version = ">= 0.13"
}

provider "aws" {
  region = "us-east-1"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners     = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn-ami-hvm-2018.03.0.20181129-x86_64-gp2"]
  }
}

resource "aws_instance" "ecs_host" {
  ami = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  tags = {
    Name = "gRPC ECS Host"
  }
}

resource "aws_ecs_cluster" "main" {
  name = "grpc-ecs-cluster"
}

resource "aws_ecs_task_definition" "my_task" {
  
}
