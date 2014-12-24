namespace UDG.Colloquium.BL.Entities.Account
{
    public class AccessDTO
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public int ExpiresIn { get; set; }
    }
}