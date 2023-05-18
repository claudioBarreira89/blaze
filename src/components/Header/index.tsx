const Header = ({ loading, smartAccount, connectWallet, logout }: any) => {
  return (
    <header className="w-full p-4 bg-white shadow-md fixed top-0 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Token Swap</h1>

      {smartAccount ? (
        <button
          disabled={loading}
          onClick={logout}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          {smartAccount?.address + " (Logout)"}
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={connectWallet}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          {"Connect Wallet"}
        </button>
      )}
    </header>
  );
};

export default Header;
