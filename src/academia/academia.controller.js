'use strict';
var Academia = require('../academia/academia');



exports.findAll = function(req, res) {
    console.log(req.userId)
    Academia.findById(req.userId)
    .then(dados => {
        res.send(dados);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algum erro ocorreu ao recuperar cliente"
        });
    });
}

exports.create = (req, res) => {
    var user = new Academia(req.body);
        if(!req.body.nome) {
            return res.status(400).send({
                message: "Nome não pode ser vazio!"
            });
        }
        user.generateHash(req.body.password)
        .then((hash) => {
            user.password = hash;
            user.save((err) => {
                if (err && err.name === 'MongoError' && err.code === 11000) {
                        res.status(400).send(err);
            } else {
                res.send(user)
            }
            });
        })
        .catch((error) => {
            res.status(401).send(err);
    });
};

exports.findOne = (req, res) => {
    Academia.findById(req.params.academiaId)
    .then(dados => {
        if(!dados) {
            return res.status(404).send({
                message: "Não existe academia com id " + req.params.academiaId
            });            
        }
        res.send(dados);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe academia com id " + req.params.academiaId
            });                
        }
        return res.status(500).send({
            message: "Erro ao buscar com id " + req.params.academiaId
        });
    });
};

exports.update = (req, res) => {
    if(!req.body.nome) {
        return res.status(400).send({
            message: "Nome não pode estar vazio!"
        });
    }

    Academia.findByIdAndUpdate(req.params.academiaId, {
        nome: req.body.nome, 
        endereco: req.body.endereco,
        cnpj: req.body.cpf,
        username: req.body.username,
        password: req.body.password
    }, {new: true})
    .then(dados => {
        if(!dados) {
            return res.status(404).send({
                message: "Não existe academia com id " + req.params.academiaId
            });
        }
        res.send(dados);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe academia com id " + req.params.academiaId
            });                
        }
        return res.status(500).send({
            message: "Erro ao atualizar com o id " + req.params.academiaId
        });
    });
};

exports.delete = (req, res) => {
    Academia.findByIdAndRemove(req.params.academiaId)
    .then(dados => {
        if(!dados) {
            return res.status(404).send({
                message: "Não existe academia com id " + req.params.academiaId
            });
        }
        res.send({message: "Academia deletada com sucesso!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Não existe academia com id  " + req.params.academiaId
            });                
        }
        return res.status(500).send({
            message: "Não foi possivel excluir com id " + req.params.academiaId
        });
    });
};

exports.findByAcademiaIdSaveCliente = (academiaId, cliente, res) =>{
    Academia.findById(academiaId)
    .then(academia => {
        if(!academia) {
            return res.status(404).send({
                message: "Não existe academia com id " + academiaId
            });            
        }
        academia.clientes.push(cliente);
        academia.save();
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe academia com id " + academiaId
            });                
        }
        return res.status(500).send({
            message: "Erro ao buscar com id " + academiaId
        });
    });
}

exports.findByAcademiaIdDeleteCliente = (academiaId, cliente, res) =>{
    Academia.findById(academiaId)
    .then(academia => {
        if(!academia) {
            return res.status(404).send({
                message: "Não existe academia com id " + academiaId
            });            
        }
        academia.clientes.remove(cliente);
        academia.save();
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Não existe academia com id " + academiaId
            });                
        }
        return res.status(500).send({
            message: "Erro ao buscar com id " + academiaId
        });
    });
}