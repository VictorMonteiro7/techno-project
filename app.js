const vm = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false,    
    carrinho: [],
    mensagemAlerta: "Item adicionado",
    alertaAtivo: false    
  },
  methods: {
    fetchProdutos(){
      fetch('./api/produtos.json')
      .then(r=>r.json())
      .then(json=>this.produtos = json)
    },
    fetchProduto(id){
      fetch(`./api/produtos/${id}/dados.json`)
      .then(r=>r.json())
      .then(json=>this.produto = json)
    },
    fecharModal({target, currentTarget}){      
      if(target === currentTarget)
        this.produto = false;              
    },
    abrirModal(id){
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })      
    },
    adicionarItem(){      
      const botaoCompra = this.$refs['btn'];            
      if(this.produto.estoque > 0){    
        this.produto.estoque--;
        const {id, nome, preco} = this.produto;
        this.carrinho.push({id, nome, preco});
        this.alerta(`${nome} foi adicionado ao carrinho`)
      }   
      if(this.produto.estoque === 0){
        botaoCompra.innerText = "Produto esgotado";
        botaoCompra.disabled = true;
      }
    },
    removerItem(index){
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(localStorage.carrinho);
      }
    },
    alerta(mensagem){
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(()=>{
        this.alertaAtivo = false;
      },1500)
    }     
  },
  computed: {
    carrinhoTotal(){
      let total = 0;
      if(this.carrinho.length){
        this.carrinho.forEach(item=>{
          total += item.preco;
        })
      }
      return total;
    }
  },
  created(){
    this.fetchProdutos();
    this.checarLocalStorage();
  },
  filters: {
    numeroPreco(valor){      
      return valor.toLocaleString('pt-BR',{style: "currency",currency:"BRL"})
    }
  },
  watch: {
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  }
})