from django.shortcuts import render

def dashboard_list(request):
    # Exemplo de dados (no futuro pode vir do banco de dados)
    meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"]
    analises = [1, 8, 15, 5, 8, 12]

    parasitas = ["Giardia lamblia", "Entamoeba histolytica", "Ascaris lumbricoides"]
    valores = [10, 20, 30]

    context = {
        "meses": meses,
        "analises": analises,
        "parasitas": parasitas,
        "valores": valores
    }
    return render(request, "dashboard/dashboard_list.html", context)
