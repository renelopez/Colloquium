using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin.Hosting;
using UDG.Colloquium.DL.DBInitializers;

namespace UDG.Colloquium.SL
{
    class Program
    {
        static void Main(string[] args)
        {
            string baseAddress = "http://localhost:9000/";

           // System.Data.Entity.Database.SetInitializer(new ColloquiumDBContextInitializer());
            // Start OWIN host 
            using (WebApp.Start<Startup>(url: baseAddress))
            {
                Console.WriteLine("Running on:" + baseAddress);
                Console.ReadLine();
            }
        }
    }
}
