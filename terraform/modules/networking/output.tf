output fr_vpc_id {
    value = aws_vpc.fr_vpc.id
}
output fr_subn_a_id {
    value = aws_subnet.fr_subn_a.id
}
output fr_subn_b_id {
    value = aws_subnet.fr_subn_b.id
}
output fr_ecs_sg_id {
    value = aws_security_group.ecs_sg.id
}
output fr_rds_sg_id {
    value = aws_security_group.rds_sg.id
}
output subn_group_name {
    value = aws_db_subnet_group.fr_rds_subn_group.name
}
