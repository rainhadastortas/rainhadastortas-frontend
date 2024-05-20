import { useContext, useEffect, useState } from 'react'

import { buscar } from '../../services/Service'
import { Toast, ToastAlerta } from '../../utils/ToastAlerta'

import Categoria from '../../models/Categoria'
import CardProdutoCliente from '../../components/produtos/cardProdutoCliente/CardProdutoCliente'
import CardProdutoAdmin from '../../components/produtos/cardProdutoAdmin/CardProdutoAdmin'
import { AuthContext } from '../../contexts/AuthContext'
import { DNA } from 'react-loader-spinner'

function Produtos() {

  const { usuario, produtos, setProdutos } = useContext(AuthContext);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  const produtosFiltrados = produtos.filter((produto) => produto.categoria?.nome === categoriaSelecionada);
  const produtosOrdenados = produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  const produtosDisponiveis = produtosOrdenados.filter((produto) => produto.disponivel);
  const produtosIndisponiveis = produtosOrdenados.filter((produto) => !produto.disponivel);
  const todosOsProdutos = [...produtosDisponiveis, ...produtosIndisponiveis];

  async function buscarCategorias() {
    try {
      await buscar('/categorias/all', setCategorias);
    } catch (error: any) {
      ToastAlerta('Não há categorias para exibir', Toast.Info);
    }
  }

  async function buscarProdutos() {
    try {
      await buscar('/produtos/all', setProdutos);
    } catch (error: any) {
      ToastAlerta('Não há produtos para exibir', Toast.Info);
    }
  }

  function handleCategoriaClick(categoriaNome: string) {
    setCategoriaSelecionada(categoriaNome);
  }

  useEffect(() => {
    buscarCategorias();
    buscarProdutos();
  }, [categoriaSelecionada, categorias.length]);

  useEffect(() => {
    if (categorias.length > 0 && categoriaSelecionada === null) {
      setCategoriaSelecionada(categorias[0].nome);
      todosOsProdutos
    }
  }, [categorias, categoriaSelecionada]);

  let produtosComponent

  if (usuario.token !== "") {

    produtosComponent = (

      <div className='container mx-auto py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {todosOsProdutos.map((produto) => (
          <CardProdutoAdmin key={produto.id} produto={produto} />
        ))}
      </div>
    )
  } else {
    produtosComponent = (

      <div className='container mx-auto py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {todosOsProdutos.map((produto) => (
          <CardProdutoCliente key={produto.id} produto={produto} />
        ))}
      </div>
    )
  }

  return (
    <>


      <div className='pt-60 min-h-[95vh]'>
        <div className='container mx-auto p-4 flex justify-evenly gap-4 rounded-xl bg-rose-500'>

          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => handleCategoriaClick(categoria.nome)}
              className={`bg-rose-100 px-2 py-1 rounded-lg hover:bg-rose-800 hover:text-rose-100 ${categoria.nome === categoriaSelecionada ? 'font-bold' : ''}`}
            >
              {categoria.nome}
            </button>
          ))}
        </div>

        {todosOsProdutos.length === 0 && (
          <DNA
            visible={true}
            height="200"
            width="200"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper mx-auto"
          />
        )}
        {produtosComponent}
      </div>
    </>
  )
}

export default Produtos;
