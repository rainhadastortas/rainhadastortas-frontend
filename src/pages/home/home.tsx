import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { DNA } from 'react-loader-spinner'

import { AuthContext } from '../../contexts/AuthContext'
// import { Toast, ToastAlerta } from '../../utils/ToastAlerta'
// import { buscarTudo } from '../../services/Service'

// import Produto from '../../models/Produto'

function Home() {
  
  let homeCoponent;

  const navigate = useNavigate();

  // const [produtos, setProdutos] = useState<Produto[]>([]);

  const { usuario } = useContext(AuthContext);

  // async function buscarProdutos() {
  //   try {
  //     await buscarTudo('/produtos/all', setProdutos);
  //   } catch (error: any) {
  //     ToastAlerta('O token expirou, favor logar novamente teste', Toast.Warning);
  //   }
  // }

  function produto() {
    navigate('/produtos');
  }

  // useEffect(() => {
  //   buscarProdutos();
  // }, [produtos.length]);

  if (usuario.token !== "") {
    homeCoponent = (
      <div className="bg-rose-50 flex justify-center pt-40 min-h-[95vh]">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex justify-around w-[60vw] h-[20vh] gap-10">
            <button className='border bg-rose-200 text-rose-900 text-5xl p-4 rounded-3xl hover:text-5xl hover:text-rose-200 hover:bg-rose-600 w-full'>
              <Link to={'/cadastroCategoria'}>Cadastrar Categoria</Link>
            </button>

            <button className='border bg-rose-200 text-rose-900 text-5xl p-4 rounded-3xl hover:text-5xl hover:text-rose-200 hover:bg-rose-600 w-full'>
              <Link to={'/cadastroProduto'}>Cadastrar Produto</Link>
            </button>
          </div>
        </div>
      </div>
    );

  } else {
    homeCoponent = (
      <>
        {/* {
          produtos.length === 0 && (
            <DNA
              visible={true}
              height="200"
              width="200"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper mx-auto"
            />
          )
        } */}
        < div className="bg-rose-50 flex items-center justify-center pt-40 min-h-[95vh]" >
          <div className="flex flex-col gap-4 text items-center justify-center py-4">
            <h2 className="text-5xl font-bold"><b>Qual é a sua Torta <b className="text-rose-600">Favorita</b>?</b></h2>

            <p className='text-2xl'>Aproveite nossas tortas artesanais!</p>
            <p className='text-2xl'>Escolha o sabor que deseja e finalize o pedido por WhatsApp.</p>

            <div className="flex justify-around gap-4">
              <button className='rounded-xl bg-white text-rose-600 py-2 px-4 hover:bg-rose-300' onClick={produto}>
                SABORES
              </button>
            </div>
          </div>
        </div >
      </>
    )
  }

  return (
    <>
      {homeCoponent}
    </>
  )
}

export default Home;
